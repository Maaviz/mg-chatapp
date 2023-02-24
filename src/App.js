import { app } from "./Components/Firebase";
import { useState, useEffect, useRef } from "react";
import Message from "./Components/Message";

import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);

const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider);
};

const logoutHandler = () => {
  signOut(auth);
};

function App() {
  const [user, setUser] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  useEffect(() => {
    const Q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscrib = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(Q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscrib();
      unsubscribeForMessage();
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");

      await addDoc(collection(db, "messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });

      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container h={"100vh"} bg={"whiteAlpha.900"}>
          <VStack h={"full"} paddingY={"4"}>
            <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
              LogOut
            </Button>

            <VStack
              h={"full"}
              w={"full"}
              overflowY={"auto"}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === item.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}

              <div ref={divForScroll}></div>
            </VStack>
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a Message"
                />
                <Button colorScheme={"purple"} type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg={"pink.100"} h={"100vh"} justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme={"purple"}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
