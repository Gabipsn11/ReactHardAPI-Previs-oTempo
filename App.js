import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando os ícones do FontAwesome
import * as Location from 'expo-location'; // Importando a API de localização do Expo
import styles from './styles/styles'; // Certifique-se de que o caminho do styles.js está correto

export default function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const API_KEY = '16a0a9a6f33c94a228d1a68b762d3f4b'; // Chave da API

  // Função para obter a localização do usuário com Expo Location
  const getLocation = async () => {
    // Verifica as permissões de localização
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a localização.');
      return;
    }

    // Obtém a localização do usuário
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      fetchWeatherByLocation(latitude, longitude);
    } catch (error) {
      setLocationError(error.message);
      Alert.alert('Erro', 'Erro ao obter localização. Verifique as permissões.');
    }
  };

  // Função para buscar o clima usando a geolocalização (latitude e longitude)
  const fetchWeatherByLocation = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: 'metric',
        },
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao buscar previsão do tempo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar cidades
  const fetchCities = async (query) => {
    if (query.length > 2) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
          {
            params: { namePrefix: query, limit: 5 },
            headers: {
              'X-RapidAPI-Key': '16a0a9a6f33c94a228d1a68b762d3f4b',
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
            },
          }
        );
        setSuggestions(response.data.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao buscar cidades. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Função para selecionar a cidade
  const selectCity = (cityName) => {
    setCity(cityName);
    setSuggestions([]);
  };

  // Função para buscar o clima da cidade
  const fetchWeather = async () => {
    if (!city) {
      Alert.alert('Erro', 'Por favor, insira o nome da cidade.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        },
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao buscar previsão do tempo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para mapear o ícone baseado no código do tempo
  const getWeatherIcon = (iconCode) => {
    const iconMapping = {
      '01d': 'sun', // Sol
      '01n': 'moon', // Lua
      '02d': 'cloud', // Nuvens
      '02n': 'cloud', // Nuvens
      '03d': 'cloud', // Nuvens
      '03n': 'cloud', // Nuvens
      '04d': 'cloud', // Nuvens
      '04n': 'cloud', // Nuvens
      '09d': 'cloud-rain', // Chuva
      '09n': 'cloud-rain', // Chuva
      '10d': 'cloud-sun', // Chuva com sol
      '10n': 'cloud-rain', // Chuva
      '11d': 'bolt', // Tempestade
      '11n': 'bolt', // Tempestade
      '13d': 'snowflake', // Neve
      '13n': 'snowflake', // Neve
      '50d': 'cloud', // Nebuloso
      '50n': 'cloud', // Nebuloso
    };

    return iconMapping[iconCode] || 'cloud'; // Retorna o ícone correspondente ou 'cloud' por padrão
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          <Icon name="cloud" size={30} color="#FFF" /> Previsão do Tempo
        </Text>

        {/* Caixa de entrada da cidade */}
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da cidade"
          value={city}
          onChangeText={text => {
            setCity(text);
            fetchCities(text); // Inicia a busca de cidades enquanto digita
          }} 
        />

        {/* Botão para obter a geolocalização */}
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Obter minha Localização</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" style={styles.loading} />}

        {/* Exibe sugestões de cidades */}
        {suggestions.length > 0 && !loading && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestion} onPress={() => selectCity(item.city)}>
                <Text style={styles.suggestionText}>{item.city}, {item.region}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Buscar Clima</Text>
        </TouchableOpacity>

        {/* Exibe os dados do clima */}
        {weatherData && (
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherText}>Cidade: {weatherData.name}</Text>
            <Text style={styles.weatherText}>Temperatura: {weatherData.main.temp}°C</Text>
            <Text style={styles.weatherText}>Condição: {weatherData.weather[0].description}</Text>
            <Text style={styles.weatherText}>
              Temperatura Mínima: {weatherData.main.temp_min}°C | Temperatura Máxima: {weatherData.main.temp_max}°C
            </Text>
            <Text style={styles.weatherText}>Umidade: {weatherData.main.humidity}%</Text>
            <Text style={styles.weatherText}>Pressão: {weatherData.main.pressure} hPa</Text>
            <Text style={styles.weatherText}>Vento: {weatherData.wind.speed} m/s</Text>
            <View style={styles.iconContainer}>
              <Icon 
                name={getWeatherIcon(weatherData.weather[0].icon)} 
                size={100} 
                color="#FFF" 
              />
            </View>
          </View>
        )}

        {/* Exibe mensagem de erro de localização */}
        {locationError && <Text style={styles.errorText}>{locationError}</Text>}
      </View>
    </ScrollView>
  );
}
