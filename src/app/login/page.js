"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

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
    // The actual input text color and placeholder color
    "& .MuiInputBase-input": {
      color: "#fff",
      "::placeholder": {
        color: "rgba(255,255,255,0.7)",
      },
    },
    // The label color (including focus state)
    "& .MuiInputLabel-root": {
      color: "#fff",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#fff",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "secondary.main", // from your custom theme
        color: "text.primary",            // ensures text is white
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      {/* Example Logo */}
      <Box mb={4}>
        <img
          src="https://chacheeschaicafe.com/wp-content/uploads/2024/08/output-onlinepngtools-2.png"
          alt="Chachee's Chai Cafe Mississuaga"
          style={{ width: "200px", height: "80px", objectFit: "contain" }}
        />
      </Box>

      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
