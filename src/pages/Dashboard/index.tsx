
import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';

interface FoodDashboard {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodDashboard[]>([]);
  const [editingFood, setEditingFood] = useState<FoodDashboard>({} as FoodDashboard);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  
  useEffect(() => {
    api.get('/foods')
      .then(response => setFoods(response.data));
    
  }, [])

  const handleAddFood = async (food: FoodDashboard) => {

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

  const handleUpdateFood = async (food: FoodDashboard) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodDashboard) => {
    setEditModalOpen(true);
    setEditingFood(food);
  } 

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
          foods.map(food => (
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
  
};

export default Dashboard;
