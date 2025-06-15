import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList, Alert } from 'react-native';
import { ChevronDown, Edit, Trash2 } from 'lucide-react-native';
import { useProfileStore } from '@/store/profileStore';
import { useAuthStore } from '@/store/authStore';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';

export default function ProfileSelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const { profiles, activeProfileId, setActiveProfile, deleteProfile } = useProfileStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const activeProfile = profiles.find(profile => profile.id === activeProfileId);
  
  const handleSelectProfile = (id: string) => {
    setActiveProfile(id);
    setModalVisible(false);
  };
  
  const handleEditProfile = (id: string) => {
    setModalVisible(false);
    router.push({
      pathname: '/profile/edit',
      params: { id },
    });
  };
  
  const handleDeleteProfile = (id: string, name: string) => {
    // Don't allow deleting the last profile
    if (profiles.length <= 1) {
      Alert.alert(
        "Cannot Delete Profile",
        "You must have at least one profile. Create a new profile before deleting this one."
      );
      return;
    }
    
    // Confirm deletion
    Alert.alert(
      "Delete Profile",
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteProfile(id),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleCreateProfile = () => {
    setModalVisible(false);
    router.push('/profile/create');
  };
  
  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.selector} 
        onPress={() => setModalVisible(true)}
        testID="profile-selector"
      >
        <Text style={styles.profileName}>
          {activeProfile?.name || 'Select Profile'}
        </Text>
        <ChevronDown size={18} color={colors.textSecondary} />
      </Pressable>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {user ? `${user.name}'s Filter Profiles` : 'Select Filter Profile'}
            </Text>
            
            <FlatList
              data={profiles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.profileItem,
                    item.id === activeProfileId && styles.activeProfileItem,
                  ]}
                  onPress={() => handleSelectProfile(item.id)}
                  testID={`profile-item-${item.id}`}
                >
                  <View style={styles.profileItemContent}>
                    <Text 
                      style={[
                        styles.profileItemText,
                        item.id === activeProfileId && styles.activeProfileItemText,
                      ]}
                    >
                      {item.name}
                    </Text>
                    
                    <Text style={styles.profileItemDetails}>
                      Min: ${item.minFare} | Max Pickup: {item.maxPickupDistance} mi | Max Drive: {item.maxDrivingDistance} mi
                    </Text>
                  </View>
                  
                  <View style={styles.profileItemActions}>
                    {item.id === activeProfileId && (
                      <View style={styles.activeIndicator} />
                    )}
                    
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleEditProfile(item.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      testID={`edit-profile-${item.id}`}
                    >
                      <Edit size={16} color={colors.textSecondary} />
                    </Pressable>
                    
                    <Pressable 
                      style={styles.actionButton}
                      onPress={() => handleDeleteProfile(item.id, item.name)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      testID={`delete-profile-${item.id}`}
                    >
                      <Trash2 size={16} color={colors.secondary} />
                    </Pressable>
                  </View>
                </Pressable>
              )}
              style={styles.profileList}
            />
            
            <Pressable
              style={styles.createButton}
              onPress={handleCreateProfile}
              testID="create-profile-button"
            >
              <Text style={styles.createButtonText}>Create New Filter Profile</Text>
            </Pressable>
            
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              testID="close-profile-selector"
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  profileList: {
    maxHeight: 300,
  },
  profileItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  activeProfileItem: {
    backgroundColor: colors.surfaceLight,
  },
  profileItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileItemDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeProfileItemText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  createButton: {
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: colors.buttonBackground,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});