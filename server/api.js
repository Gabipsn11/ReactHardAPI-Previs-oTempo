import axios from 'axios';

export const getWeather = async (city, apiKey) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar os dados do clima');
  }
};
