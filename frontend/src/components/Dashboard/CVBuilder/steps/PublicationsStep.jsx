import ArrayFieldManager from '../forms/ArrayFieldManager';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';

const PublicationsStep = ({ formData, onArrayAdd, onArrayRemove, onArrayUpdate }) => {
  const newPublication = { title: '', journal: '', year: '', type: 'research-article' };
  
  const renderPublication = (publication, index) => (
    <div>
      <FormGrid>
        <FormField
          label="Title"
          value={publication.title}
          onChange={(value) => onArrayUpdate('publications', index, 'title', value)}
        />
        
        <FormField
          label="Journal"
          value={publication.journal}
          onChange={(value) => onArrayUpdate('publications', index, 'journal', value)}
        />
        
        <FormField
          label="Year"
          value={publication.year}
          onChange={(value) => onArrayUpdate('publications', index, 'year', value)}
        />
        
        <FormField
          label="Type"
          type="select"
          value={publication.type}
          options={[
            { value: 'research-article', label: 'Research Article' },
            { value: 'case-report', label: 'Case Report' }
          ]}
          onChange={(value) => onArrayUpdate('publications', index, 'type', value)}
        />
      </FormGrid>
    </div>
  );

  return (
    <ArrayFieldManager
      title="Publications"
      items={formData.publications}
      onAdd={(item) => onArrayAdd('publications', item)}
      onRemove={(index) => onArrayRemove('publications', index)}
      renderItem={renderPublication}
      newItemTemplate={newPublication}
    />
  );
};

export default PublicationsStep;