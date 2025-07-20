import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState, ...props }) => {
    const { image, price, name, _id } = ingredient;

    return (
      <li {...props} data-testid={`ingredient-${ingredient.type}`}>
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
          data-testid={`ingredient-link`}
        >
          {count && <Counter count={count} />}
          <img
            className={styles.img}
            src={image}
            alt={`Изображение ${name}`}
            data-testid={`ingredient-image`}
          />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type={'primary'} />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        <div data-testid='ingredient-add-container'>
          <AddButton
            text='Добавить'
            onClick={handleAdd}
            extraClass={`${styles.addButton} mt-8`}
          />
        </div>
      </li>
    );
  }
);
