import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const { ingredients, loading } = useAppSelector((state) => state.ingredients);

  if (loading) return <Preloader />;

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return (
      <p className='text text_type_main-default mt-20'>Ингредиент не найден</p>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
