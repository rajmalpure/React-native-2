import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Modal
} from 'react-native';

export default function App() {
  // State Management (like variables that can change and update the UI)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', amount: 5000, description: 'Salary', category: 'Work', date: '2024-01-15' },
    { id: 2, type: 'expense', amount: 1200, description: 'Rent', category: 'Housing', date: '2024-01-16' },
    { id: 3, type: 'expense', amount: 300, description: 'Groceries', category: 'Food', date: '2024-01-17' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: 'Food'
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Add new transaction function
  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const transaction = {
      id: Date.now(), // Simple ID generation
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      date: new Date().toISOString().split('T')[0] // Today's date
    };

    setTransactions([transaction, ...transactions]); // Add to beginning of array
    setNewTransaction({ type: 'expense', amount: '', description: '', category: 'Food' });
    setShowAddModal(false);
    Alert.alert('Success', 'Transaction added!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Finance Tracker</Text>
        <Text style={styles.headerSubtitle}>Track your money easily</Text>
      </View>

      {/* Balance Cards */}
      <View style={styles.balanceContainer}>
        <View style={[styles.balanceCard, styles.incomeCard]}>
          <Text style={styles.balanceLabel}>Income</Text>
          <Text style={styles.balanceAmount}>₹{totalIncome.toLocaleString()}</Text>
        </View>
        
        <View style={[styles.balanceCard, styles.expenseCard]}>
          <Text style={styles.balanceLabel}>Expenses</Text>
          <Text style={styles.balanceAmount}>₹{totalExpenses.toLocaleString()}</Text>
        </View>
        
        <View style={[styles.balanceCard, styles.totalCard]}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={[styles.balanceAmount, { color: balance >= 0 ? '#4CAF50' : '#F44336' }]}>
            ₹{balance.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Add Transaction Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {/* Transactions List */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      
      <ScrollView style={styles.transactionsList}>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: transaction.type === 'income' ? '#4CAF50' : '#F44336' }
            ]}>
              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Transaction</Text>
            
            {/* Transaction Type Toggle */}
            <View style={styles.typeToggle}>
              <TouchableOpacity 
                style={[
                  styles.typeButton,
                  newTransaction.type === 'income' && styles.activeTypeButton
                ]}
                onPress={() => setNewTransaction({...newTransaction, type: 'income'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  newTransaction.type === 'income' && styles.activeTypeButtonText
                ]}>Income</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.typeButton,
                  newTransaction.type === 'expense' && styles.activeTypeButton
                ]}
                onPress={() => setNewTransaction({...newTransaction, type: 'expense'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  newTransaction.type === 'expense' && styles.activeTypeButtonText
                ]}>Expense</Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <TextInput
              style={styles.input}
              placeholder="Amount (e.g., 1500)"
              value={newTransaction.amount}
              onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
              keyboardType="numeric"
            />

            {/* Description Input */}
            <TextInput
              style={styles.input}
              placeholder="Description (e.g., Lunch, Salary)"
              value={newTransaction.description}
              onChangeText={(text) => setNewTransaction({...newTransaction, description: text})}
            />

            {/* Category Selection */}
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Work', 'Other'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      newTransaction.category === cat && styles.activeCategoryChip
                    ]}
                    onPress={() => setNewTransaction({...newTransaction, category: cat})}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      newTransaction.category === cat && styles.activeCategoryChipText
                    ]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={addTransaction}
              >
                <Text style={styles.saveButtonText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50, // Status bar padding
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    textAlign: 'center',
    marginTop: 5,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: -15,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  incomeCard: {
    borderTopWidth: 3,
    borderTopColor: '#4CAF50',
  },
  expenseCard: {
    borderTopWidth: 3,
    borderTopColor: '#F44336',
  },
  totalCard: {
    borderTopWidth: 3,
    borderTopColor: '#2196F3',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6366f1',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
    color: '#333',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  typeToggle: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  typeButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: '#6366f1',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
  },
  activeCategoryChipText: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});