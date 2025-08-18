import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';

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
      setRecados(data.reverse()); // Mostrar os mais recentes primeiro
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Mural de Recados</Text>
          <Text style={styles.subtitulo}>Compartilhe suas mensagens</Text>
        </View>
        
        {/* Formulário */}
        <View style={styles.formulario}>
          <Text style={styles.label}>Seu Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={autor}
            onChangeText={setAutor}
          />
          
          <Text style={styles.label}>Sua Mensagem:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escreva seu recado aqui..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={mensagem}
            onChangeText={setMensagem}
          />
          
          <TouchableOpacity 
            style={[styles.botao, carregando && styles.botaoDesabilitado]} 
            onPress={publicarRecado}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.textoBotao}>
                Publicar Recado <Text style={styles.emoji}>✉️</Text>
              </Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Lista de Recados */}
        <Text style={styles.listaTitulo}>Recados Recentes</Text>
        {recados.length === 0 ? (
          <View style={styles.recadoVazio}>
            <Text style={styles.recadoVazioTexto}>Nenhum recado ainda. Seja o primeiro!</Text>
          </View>
        ) : (
          recados.map((recado, index) => (
            <View key={index} style={[
              styles.recado,
              index === 0 && styles.recadoDestaque
            ]}>
              <View style={styles.recadoCabecalho}>
                <Text style={styles.autorRecado}>{recado.autor}</Text>
                <View style={styles.recadoData}>
                  <Text style={styles.recadoDataTexto}>agora mesmo</Text>
                </View>
              </View>
              <Text style={styles.mensagemRecado}>{recado.mensagem}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  formulario: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#34495e',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  botaoDesabilitado: {
    backgroundColor: '#bdc3c7',
    shadowColor: '#95a5a6',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 18,
  },
  listaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    marginLeft: 5,
  },
  recado: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  recadoDestaque: {
    borderLeftColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOpacity: 0.1,
  },
  recadoVazio: {
    backgroundColor: '#f1f1f1',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recadoVazioTexto: {
    color: '#7f8c8d',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recadoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  autorRecado: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#2c3e50',
  },
  recadoData: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recadoDataTexto: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  mensagemRecado: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
});