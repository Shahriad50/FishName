import { View, Text,StyleSheet} from 'react-native'
import { Appbar,Menu } from 'react-native-paper';
import React,{useState} from 'react'

export const CustomNavigation = () => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <Appbar.Header style={styles.header}>
      <Appbar.Action icon="menu" color="black" onPress={openMenu} />
      <Appbar.Content title="FISHNAME" titleStyle={styles.title} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
      >
        {/*  */}
      </Menu>
    </Appbar.Header >
  );
}
const styles=StyleSheet.create({
  header:{
    
    backgroundColor:'#FF9933',
   
  },
  title: {
    color:'#000',// Change title color
    fontWeight: 'bold' // Increase font weight
  }
})

export default CustomNavigation