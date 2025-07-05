import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import styles from '../../components/ui//ingredient-details/ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const { ingredients, loading } = useAppSelector((state) => state.ingredients);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Preloader />
      </div>
    );
  }

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return (
      <div className={styles.notFound}>
        <p className='text text_type_main-default mt-20'>
          Ингредиент не найден
        </p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
