import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const { ingredients, loading } = useAppSelector((state) => state.ingredients);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }
  if (loading) return <Preloader />;
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
