import ArrayFieldManager from '../forms/ArrayFieldManager';
import FormField from '../forms/FormField';
import FormGrid from '../forms/FormGrid';

const PublicationsStep = ({ formData, onArrayAdd, onArrayRemove }) => {
  const newPublication = { title: '', journal: '', year: '', type: 'research-article' };

  const renderPublication = (publication, index) => (
    <div>
      <FormGrid>
        <FormField
          label="Title"
          value={publication.title}
          onChange={(value) => {
            const updated = [...formData.publications];
            updated[index] = { ...updated[index], title: value };
            // would need to be handled by parent component
          }}
        />
        
        <FormField
          label="Journal"
          value={publication.journal}
          onChange={(value) => {
            const updated = [...formData.publications];
            updated[index] = { ...updated[index], journal: value };
          }}
        />
        
        <FormField
          label="Year"
          value={publication.year}
          onChange={(value) => {
            const updated = [...formData.publications];
            updated[index] = { ...updated[index], year: value };
          }}
        />
        
        <FormField
          label="Type"
          type="select"
          value={publication.type}
          options={[
            { value: 'research-article', label: 'Research Article' },
            { value: 'case-report', label: 'Case Report' }
          ]}
          onChange={(value) => {
            const updated = [...formData.publications];
            updated[index] = { ...updated[index], type: value };
          }}
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