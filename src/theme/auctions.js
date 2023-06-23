import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import AuctionsTwo from '../components/Auctions/AuctionsTwo';
// import Footer from '../components/Footer/Footer';
// import ModalSearch from '../components/Modal/ModalSearch';
// import ModalMenu from '../components/Modal/ModalMenu';
// import Scrollup from '../components/Scrollup/Scrollup';

class Auctions extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                {/* <Breadcrumb title="Staking" subpage="Explore" page="Live Auctions" /> */}
                <AuctionsTwo />
                {/* <Footer />
                <ModalSearch />
                <ModalMenu />
                <Scrollup /> */}
            </div>
        );
    }
}

export default Auctions;