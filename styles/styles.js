import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#3e7c8b',
    paddingHorizontal: 20,
    paddingVertical: 40,
    width: '100%',
  },
  title: {
    fontSize: 30,
    color: '#FFF',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#FFF',
    borderBottomWidth: 2,
    marginBottom: 20,
    color: '#FFF',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9900',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherInfo: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  weatherText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    width: '100%',
  },
  iconContainer: {
    marginTop: 10,
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  suggestionText: {
    color: '#FFF',
    fontSize: 16,
  },
  loading: {
    marginTop: 20,
  },
});

export default styles;
