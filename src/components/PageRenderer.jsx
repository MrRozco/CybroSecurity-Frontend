import ComponentRenderer from './ComponentRenderer';

export default function PageRenderer({ page, componentProps = {} }) {
  if (!page || typeof page !== 'object') {
    return null;
  }

  const { content } = page;

  
  return (
    <div>
      {Array.isArray(content) && content.map((component, index) => (
        <ComponentRenderer
          key={index}
          component={component}
          componentProps={componentProps[component.__component] || {}}
        />
      ))}
    </div>
  );
}