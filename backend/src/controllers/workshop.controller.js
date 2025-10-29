import { Workshop } from '../models/workshop.model.js';
import { User } from '../models/users.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createWorkshop = asyncHandler(async (req, res) => {
  const { title, description, type, date, startTime, endTime, location, capacity, instructor } = req.body;

  if (!title || !description || !type || !date || !startTime || !endTime || !location || !capacity || !instructor) {
    throw new ApiError(400, 'All fields are required');
  }

  const workshop = await Workshop.create({
    title,
    description,
    type,
    date,
    startTime,
    endTime,
    location,
    capacity,
    instructor
  });

  return res.status(201).json(
    new ApiResponse(201, workshop, 'Workshop created successfully')
  );
});

const getAllWorkshops = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let query = {};

  if (month && year) {
    const monthIndex = new Date(Date.parse(month + ' 1, 2000')).getMonth();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);

    query.date = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const workshops = await Workshop.find(query)
    .populate('registeredUsers', 'firstName lastName email')
    .sort({ date: 1 });

  return res.status(200).json(
    new ApiResponse(200, workshops, 'Workshops fetched successfully')
  );
});

const getWorkshopById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workshop = await Workshop.findById(id)
    .populate('registeredUsers', 'firstName lastName email');

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  return res.status(200).json(
    new ApiResponse(200, workshop, 'Workshop fetched successfully')
  );
});

const updateWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workshop = await Workshop.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  return res.status(200).json(
    new ApiResponse(200, workshop, 'Workshop updated successfully')
  );
});

const deleteWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workshop = await Workshop.findByIdAndDelete(id);

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  await User.updateMany(
    { 'workshopRegistrations.workshop': id },
    { $pull: { workshopRegistrations: { workshop: id } } }
  );

  return res.status(200).json(
    new ApiResponse(200, null, 'Workshop deleted successfully')
  );
});

const getUpcomingWorkshops = asyncHandler(async (req, res) => {
  const currentDate = new Date();

  const workshops = await Workshop.find({
    date: { $gte: currentDate },
    status: 'scheduled'
  })
    .populate('registeredUsers', 'firstName lastName email')
    .sort({ date: 1 })
    .limit(10);

  return res.status(200).json(
    new ApiResponse(200, workshops, 'Upcoming workshops fetched successfully')
  );
});

const registerForWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.workshopRegistrations && user.workshopRegistrations.length > 0) {
    throw new ApiError(400, 'You can only register for one workshop at a time. Please cancel your existing registration first.');
  }

  const workshop = await Workshop.findById(id);

  if (!workshop) {
    throw new ApiError(404, 'Workshop not found');
  }

  if (workshop.registeredUsers.includes(userId)) {
    throw new ApiError(400, 'You are already registered for this workshop');
  }

  if (workshop.registeredUsers.length >= workshop.capacity) {
    throw new ApiError(400, 'Workshop is fully booked');
  }

  if (new Date(workshop.date) < new Date()) {
    throw new ApiError(400, 'Cannot register for past workshops');
  }

  workshop.registeredUsers.push(userId);
  await workshop.save();

  await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        workshopRegistrations: {
          workshop: id,
          registeredAt: new Date(),
          status: 'registered'
        }
      }
    }
  );

  return res.status(200).json(
    new ApiResponse(200, workshop, 'Successfully registered for workshop')
  );
});

const getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate({
      path: 'workshopRegistrations.workshop',
      select: 'title description type date startTime endTime location capacity instructor status'
    });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(
    new ApiResponse(200, user.workshopRegistrations, 'Registrations fetched successfully')
  );
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const registration = user.workshopRegistrations.id(registrationId);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  const workshopId = registration.workshop;

  await Workshop.findByIdAndUpdate(
    workshopId,
    { $pull: { registeredUsers: userId } }
  );

  user.workshopRegistrations.pull(registrationId);
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, null, 'Registration cancelled successfully')
  );
});

export {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop,
  getUpcomingWorkshops,
  registerForWorkshop,
  getUserRegistrations,
  cancelRegistration
};