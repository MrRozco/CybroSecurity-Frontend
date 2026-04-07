import styles from './styles.module.scss';

const CrewHeader = ({ data }) => {
  const { title, description } = data || {};

  return (
    <header className={styles.crewHeader}>
      <h1 className={styles.crewHeader__title}>{title}</h1>
      <div className={styles.crewHeader__body}>
        <div className={styles.crewHeader__description}>{description}</div>
      </div>
    </header>
  );
};

export default CrewHeader;
