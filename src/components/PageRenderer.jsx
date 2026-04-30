import ComponentRenderer from './ComponentRenderer';

export default function PageRenderer({ page, componentProps = {} }) {
  const { title, description, content } = page;

  
  return (
    <div>
      {content && content.map((component, index) => (
        <ComponentRenderer
          key={index}
          component={component}
          componentProps={componentProps[component.__component] || {}}
        />
      ))}
    </div>
  );
}