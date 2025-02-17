import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Définir le type des paramètres de navigation
type RootStackParamList = {
  Home: undefined;
  ProductList: undefined;
  BarcodeScanner: undefined;
  AddProduct: undefined;
  ProductDetail: { productId: string };
  Login: undefined;
};

// Créer un type pour la navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATALOG_ITEMS = [
  { id: '1', name: 'Electronics', image: require('../../assets/electronics.jpg') },
  { id: '2', name: 'Furniture', image: require('../../assets/furniture.jpg') },
  { id: '3', name: 'Tools', image: require('../../assets/tools.jpg') },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={require('../../assets/warehouse-banner.jpg')}
        style={styles.headerImage}
      />
      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Gestion de Stock</Text>
        <Text style={styles.headerSubtitle}>Gérez votre inventaire efficacement</Text>
      </View>
    </View>
  );

  const renderNavBar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('ProductList')}>
        <Icon name="list" size={24} color="#333" />
        <Text style={styles.navText}>Produits</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('BarcodeScanner')}>
        <Icon name="qr-code-scanner" size={24} color="#333" />
        <Text style={styles.navText}>Scanner</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('AddProduct')}>
        <Icon name="add-circle" size={24} color="#333" />
        <Text style={styles.navText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCatalog = () => (
    <View style={styles.catalogSection}>
      <Text style={styles.sectionTitle}>Catalogue</Text>
      <FlatList
        horizontal
        data={CATALOG_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.catalogItem}
            onPress={() => navigation.navigate('ProductList')}>
            <Image source={item.image} style={styles.catalogImage} />
            <Text style={styles.catalogItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutSection}>
      <Text style={styles.sectionTitle}>À Propos</Text>
      <View style={styles.aboutCard}>
        <Icon name="info" size={40} color="#4A90E2" />
        <Text style={styles.aboutTitle}>Notre Solution</Text>
        <Text style={styles.aboutText}>
          Une solution complète de gestion de stock pour optimiser votre inventaire 
          et améliorer votre efficacité opérationnelle.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        {renderHeader()}
        {renderNavBar()}
        {renderCatalog()}
        {renderAbout()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: Dimensions.get('window').width,
    height: 200,
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
  catalogSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  catalogItem: {
    marginRight: 15,
    width: 150,
  },
  catalogImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  catalogItemText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  aboutSection: {
    padding: 20,
  },
  aboutCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  aboutText: {
    textAlign: 'center',
    lineHeight: 22,
    color: '#666',
  },
});

export default HomeScreen;