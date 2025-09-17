import ComponentRenderer from './ComponentRenderer';

export default function PageRenderer({ page }) {
  const { title, description, content } = page;

  
  return (
    <div>
      {content && content.map((component, index) => (
        <ComponentRenderer key={index} component={component} />
      ))}
    </div>
  );
}