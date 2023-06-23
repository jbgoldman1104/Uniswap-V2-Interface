import React from 'react';
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { Flex } from '@chakra-ui/react';
import Layout from "../Layout";
import ConnectButton from "../ConnectButton";
import AccountModal from "../AccountModal";

const Header = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <header id="header container" >
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="">
            <div  style={{display:"flex", justifyContent:"center", alignItems:"center", flexWrap:"wrap"}}>
                <img className="" src="img/logo.png" style={{height:"50px"}} alt="sticky brand-logo" />         
                <span style={{flex:"1"}}></span>           
                <span className="" style={{marginTop:20}}>
                    <ConnectButton  handleOpenModal={onOpen} />
                    <AccountModal isOpen={isOpen} onClose={onClose} />                    
                </span>
            </div>
        </nav>
        </header>
    );
};

export default Header;