"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
  Button,
  AppBar,
  Toolbar,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

const OrdersTable = dynamic(
  () => import('@/components/OrdersTable'),
  { ssr: false }
);

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const formatDuration = (durationInSeconds) => {
  if (!durationInSeconds) return "N/A";
  const seconds = parseInt(durationInSeconds, 10);
  if (isNaN(seconds)) return "N/A";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <motion.div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={value === index ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editText, setEditText] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [mainTabValue, setMainTabValue] = useState(0);

  const handleMainTabChange = (event, newValue) => {
    setMainTabValue(newValue);
  };

  useEffect(() => {
    const savedSetting = localStorage.getItem("call_route_enabled");
    if (savedSetting !== null) {
      setEnabled(savedSetting === "true");
    }
  }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      setUsageLoading(true);
      try {
        const res = await axios.get("/api/usage");
        setUsage(res.data);
      } catch (error) {
        console.error("Failed to fetch usage:", error.message);
      } finally {
        setUsageLoading(false);
      }
    };
    fetchUsage();
  }, []);

  const toggleHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/toggle-call-route", {
        useWebhook: !enabled,
      });
      if (response.data.success) {
        setEnabled(!enabled);
        localStorage.setItem("call_route_enabled", String(!enabled));
      } else {
        alert("Failed to update Twilio route: " + response.data.error);
      }
    } catch (error) {
      alert("Request error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      router.push("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const handleSendEditRequest = async () => {
    setSending(true);
    try {
      await axios.post("/api/sendEditRequest", { text: editText });
      setEditText("");
      setSuccessMessage("Edit request sent successfully!");
  
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      alert("Failed to send edit request: " + error.message);
    } finally {
      setSending(false);
    }
  };  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <motion.div variants={childVariants}>
        <AppBar position="static" color="secondary" sx={{ py: 2 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center">
              <img
                src="https://chacheeschaicafe.com/wp-content/uploads/2024/08/output-onlinepngtools-2.png"
                alt="Chachee's Chai Cafe Mississuaga"
                width={100}
                height={50}
                style={{ objectFit: "contain", marginRight: "1rem" }}
              />
            </Box>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </motion.div>

      <Box sx={{ border: 'none' }}>
        <Tabs value={mainTabValue} onChange={handleMainTabChange} centered
          sx={{"& .MuiTabs-indicator": {backgroundColor: "#F05A28"}}}>
          <Tab label="General" sx={{color:"#fff","&.Mui-selected":{color:"#F05A28"}}}/>
          <Tab label="Orders" sx={{color:"#fff","&.Mui-selected":{color:"#F05A28"}}}/>
        </Tabs>
      </Box>

      <motion.div variants={childVariants}>
        <Box sx={{ minHeight: "100vh", backgroundColor: "secondary.main", color: "text.primary", py: 4 }}>
          <Container maxWidth="lg">
            <TabPanel value={mainTabValue} index={0}>
              <Typography variant="h5" component="h1">
                Manage AI Voice Agent
              </Typography>
              <Box mt={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabled}
                      onChange={toggleHandler}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label={<Typography>{enabled ? "AI Agent On" : "AI Agent Off"}</Typography>}
                />
              </Box>
              {loading && <Box display="flex" justifyContent="center" mt={2}><CircularProgress size={24}/></Box>}

              <Box mt={6}>
                <Typography variant="h5" component="h1">Request an Edit</Typography>
                <TextField
                  label="Enter your edit request"
                  multiline
                  minRows={4}
                  fullWidth
                  variant="outlined"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  sx={{
                    backgroundColor: "#cfc",
                    borderRadius: 1,
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#F05A28" },
                      "&:hover fieldset": { borderColor: "#F05A28" },
                      "&.Mui-focused fieldset": { borderColor: "#F05A28" },
                    },
                    "& .MuiInputBase-input": { color: "#000" },
                    "& .MuiInputLabel-root": { color: "#000" },
                  }}
                />
                <Box display="flex" alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendEditRequest}
                    disabled={sending || editText.trim() === ""}
                  >
                    {sending ? "Sending..." : "Send"}
                  </Button>
                  {sending && <Box ml={2}><CircularProgress size={24} color="primary"/></Box>}
                </Box>
                {successMessage && (
                  <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
                    {successMessage}
                  </Typography>
                )}
              </Box>

              <Box mt={6}>
                <Typography variant="h5" component="h1">This Month's Usage Stats</Typography>
                {usageLoading ? (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress size={24}/>
                  </Box>
                ) : usage ? (
                  <Box mt={2}>
                    <Typography variant="body1"><strong>Total Calls Received:</strong> {usage.totalCalls}</Typography>
                    <Typography variant="body1"><strong>Total Call Duration:</strong> {formatDuration(usage.totalCallDurationMinutes * 60)}</Typography>
                    <Typography variant="body1"><strong>Total Texts Sent:</strong> {usage.totalTexts}</Typography>

                    <Box mt={4}>
                      <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="Usage Details Tabs"
                        textColor="inherit"
                        indicatorColor="primary"
                        sx={{"& .MuiTabs-indicator": {backgroundColor: "#F05A28"}}}
                      >
                        <Tab label="Call Details" sx={{color:"#fff","&.Mui-selected":{color:"#F05A28"}}}/>
                        <Tab label="Text Details" sx={{color:"#fff","&.Mui-selected":{color:"#F05A28"}}}/>
                      </Tabs>

                      <TabPanel value={tabValue} index={0}>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="call details table">
                            <TableHead><TableRow>
                              <TableCell><strong>From</strong></TableCell>
                              <TableCell align="right"><strong>Duration</strong></TableCell>
                              <TableCell align="right"><strong>Status</strong></TableCell>
                              <TableCell align="right"><strong>Start Time</strong></TableCell>
                            </TableRow></TableHead>
                            <TableBody>
                              {usage.callDetails.map((call, index) => (
                                <TableRow key={index}>
                                  <TableCell>{call.from}</TableCell>
                                  <TableCell align="right">{formatDuration(call.duration)}</TableCell>
                                  <TableCell align="right">{call.status}</TableCell>
                                  <TableCell align="right">
                                    {call.startTime ? new Date(call.startTime).toLocaleString() : "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TabPanel>

                      <TabPanel value={tabValue} index={1}>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="text details table">
                            <TableHead><TableRow>
                              <TableCell><strong>To</strong></TableCell>
                              <TableCell align="right"><strong>Status</strong></TableCell>
                              <TableCell align="right"><strong>Date Sent</strong></TableCell>
                            </TableRow></TableHead>
                            <TableBody>
                              {usage.textDetails.map((msg, index) => (
                                <TableRow key={index}>
                                  <TableCell>{msg.to}</TableCell>
                                  <TableCell align="right">{msg.status}</TableCell>
                                  <TableCell align="right">
                                    {msg.dateSent ? new Date(msg.dateSent).toLocaleString() : "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </TabPanel>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            </TabPanel>
            <TabPanel value={mainTabValue} index={1}>
              <Typography variant="h5" component="h1" gutterBottom>
                Order Management
              </Typography>
              <OrdersTable />
            </TabPanel>
          </Container>
        </Box>
      </motion.div>
    </div>
  );
}