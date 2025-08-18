import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';

export default function App() {
  const [autor, setAutor] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [recados, setRecados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const API_URL = 'https://api-mural.onrender.com/recados';

  // Função para buscar recados existentes
  const buscarRecados = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Erro ao buscar recados');
      }
      const data = await response.json();
      setRecados(data);
    } catch (error) {
      console.error('Erro ao buscar recados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os recados existentes');
    }
  };

  // Buscar recados ao carregar o componente
  useEffect(() => {
    buscarRecados();
  }, []);

  const publicarRecado = async () => {
    // Validação dos campos
    if (!autor.trim() || !mensagem.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha seu nome e a mensagem.');
      return;
    }

    setCarregando(true);

    try {
      const novoRecado = {
        autor: autor,
        mensagem: mensagem
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoRecado),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o recado para a API');
      }

      Alert.alert('Sucesso!', 'Seu recado foi publicado no mural.');
      setAutor('');
      setMensagem('');
      
      // Atualiza a lista de recados após publicação
      await buscarRecados();
    } catch (error) {
      console.error('Erro ao enviar recado:', error);
      Alert.alert('Erro', 'Não foi possível enviar seu recado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mural de Recados</Text>
      
      <View style={styles.formulario}>
        <Text style={styles.label}>Seu Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={autor}
          onChangeText={setAutor}
        />
        
        <Text style={styles.label}>Sua Mensagem:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escreva seu recado aqui..."
          multiline
          numberOfLines={4}
          value={mensagem}
          onChangeText={setMensagem}
        />
        
        <TouchableOpacity 
          style={styles.botao} 
          onPress={publicarRecado}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Publicar Recado</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.listaRecados}>
        {recados.map((recado, index) => (
          <View key={index} style={styles.recado}>
            <Text style={styles.autorRecado}>{recado.autor}</Text>
            <Text style={styles.mensagemRecado}>{recado.mensagem}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
  },
  formulario: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#34495e',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  botaoDesabilitado: {
    backgroundColor: '#bdc3c7',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listaRecados: {
    flex: 1,
  },
  recado: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  autorRecado: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#2c3e50',
  },
  mensagemRecado: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});