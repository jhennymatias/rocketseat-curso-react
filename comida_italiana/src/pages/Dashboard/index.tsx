import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodInput{
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface FoodId {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export default function Dashboard() {
  const [foods, setFoods] = useState<FoodId []>([]);
  const [editingFood, setEditingFood] = useState<FoodId>({} as FoodId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    api.get('/foods').then(response => setFoods(response.data));
  }, [])

  const handleAddFood = async (food: FoodInput) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodId) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }


  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter((food: FoodId) => food.id !== id);
    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodId) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }
  console.log(foods)
  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food: FoodId) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
     
            />
          ))}
      </FoodsContainer>
    </>
  );
}
