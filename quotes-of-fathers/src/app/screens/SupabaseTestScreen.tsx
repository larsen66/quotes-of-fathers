import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { testSupabaseConnection } from '../../test-supabase';
import { testDataSync } from '../../test-data-sync';

export default function SupabaseTestScreen() {
  const [testing, setTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [dataTesting, setDataTesting] = useState(false);
  const [dataTestComplete, setDataTestComplete] = useState(false);
  const [dataTestSuccess, setDataTestSuccess] = useState(false);

  const runConnectionTest = async () => {
    console.clear();
    console.log("=".repeat(50));
    console.log("SUPABASE CONNECTION TEST");
    console.log("=".repeat(50));
    
    setTesting(true);
    setTestComplete(false);
    
    const success = await testSupabaseConnection();
    
    setTestSuccess(success);
    setTestComplete(true);
    setTesting(false);
  };

  const runDataTest = async () => {
    console.log("=".repeat(50));
    console.log("DATA SYNC TEST");
    console.log("=".repeat(50));
    
    setDataTesting(true);
    setDataTestComplete(false);
    
    const success = await testDataSync();
    
    setDataTestSuccess(success);
    setDataTestComplete(true);
    setDataTesting(false);
  };

  useEffect(() => {
    runConnectionTest();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧪 Supabase Connection Test</Text>
        
        {testing && (
          <View style={styles.testingBox}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.testingText}>Testing connection...</Text>
          </View>
        )}

        {testComplete && (
          <View style={[
            styles.resultBox,
            testSuccess ? styles.successBox : styles.errorBox
          ]}>
            <Text style={styles.resultText}>
              {testSuccess ? '✅ Connection Successful!' : '❌ Connection Failed'}
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📱 Check the console for details:</Text>
          <Text style={styles.infoText}>• Open terminal where Expo is running</Text>
          <Text style={styles.infoText}>• Look for test results</Text>
          <Text style={styles.infoText}>• Tables: fathers, quotes, feedback</Text>
          <Text style={styles.infoText}>• Storage: fathers bucket</Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, testing && styles.buttonDisabled]}
          onPress={runConnectionTest}
          disabled={testing}
        >
          <Text style={styles.buttonText}>🔄 Re-run Connection Test</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📊 Test Data Sync</Text>
          <Text style={styles.infoText}>After inserting test data in Supabase, test loading it here.</Text>
        </View>

        {dataTesting && (
          <View style={styles.testingBox}>
            <ActivityIndicator size="large" color="#28a745" />
            <Text style={styles.testingText}>Loading data...</Text>
          </View>
        )}

        {dataTestComplete && (
          <View style={[
            styles.resultBox,
            dataTestSuccess ? styles.successBox : styles.errorBox
          ]}>
            <Text style={styles.resultText}>
              {dataTestSuccess ? '✅ Data Loaded Successfully!' : '❌ Data Load Failed'}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.dataButton, dataTesting && styles.buttonDisabled]}
          onPress={runDataTest}
          disabled={dataTesting}
        >
          <Text style={styles.buttonText}>🔄 Test Data Sync</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  testingBox: {
    padding: 20,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    marginBottom: 20,
    alignItems: 'center',
  },
  testingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultBox: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoBox: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dataButton: {
    backgroundColor: '#28a745',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
