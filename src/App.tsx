import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import "@fontsource/inter";

import Auctions from "./theme/auctions";

function App() {
  return (
      <ChakraProvider theme={theme}>
          <Auctions />
      </ChakraProvider>
  );
}

export default App;
