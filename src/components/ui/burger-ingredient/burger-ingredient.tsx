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
    const { image, price, name, _id, type } = ingredient;

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(ingredient));
      e.dataTransfer.effectAllowed = 'move';
    };

    return (
      <li
        {...props}
        data-testid-type={ingredient.type}
        draggable
        onDragStart={handleDragStart}
      >
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
          <div
            className={`${styles.cost} mt-2 mb-2`}
            data-testid='ingredient-price'
          >
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p
            className={`text text_type_main-default ${styles.text}`}
            data-testid='ingredient-name'
          >
            {name}
          </p>
        </Link>
        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
          data-testid='ingredient-add-button'
        />
      </li>
    );
  }
);
