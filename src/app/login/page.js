"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

// Variants for container and its children
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/login", { username, password });
      if (res.data.success) {
        router.push("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  // Common styling for white text, white border, etc.
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fff",
      },
      "&:hover fieldset": {
        borderColor: "#fff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
      },
    },
    "& .MuiInputBase-input": {
      color: "#fff",
      "::placeholder": {
        color: "rgba(255,255,255,0.7)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#fff",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fff",
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "secondary.main", // from your custom theme
          color: "text.primary", // ensures text is white
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        {/* Animated Logo */}
        <motion.div variants={childVariants}>
          <Box mb={4}>
            <img
              src="https://chacheeschaicafe.com/wp-content/uploads/2024/08/output-onlinepngtools-2.png"
              alt="Chachee's Chai Cafe Mississuaga"
              style={{
                width: "200px",
                height: "80px",
                objectFit: "contain",
              }}
            />
          </Box>
        </motion.div>

        <motion.div variants={childVariants}>
          <Container maxWidth="sm">
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
            >
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={textFieldStyles}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={textFieldStyles}
              />
              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ mt: 1, mb: 2 }}
                >
                  {error}
                </Typography>
              )}
              <motion.div variants={childVariants}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  component={motion.button}
                >
                  Log In
                </Button>
              </motion.div>
            </Box>
          </Container>
        </motion.div>
      </Box>
    </motion.div>
  );
}
