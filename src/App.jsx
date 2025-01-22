import { useState } from 'react'
import './App.css'
import { Container, Typography, Box, TextField, InputLabel, Select, MenuItem, FormControl, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

function App() {
const [emailContent, setEmailContent] = useState('');
const [tone, setTone] = useState('');
const [generatedReply, setGeneratedReply] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async() => {
  setLoading(true)
  setError('')
  try {
    const response = await axios.post("http://localhost:8080/api/email/generate",
    {
      emailContent,
      tone
    }
    )
    setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
  } catch (error) {
    setError("Failed to generate email reply. Please try again!")
    console.error(error)
  } finally {
    setLoading(false)
  }
};

  return (
    <Container maxWidth="md" sx={{py:4}}>
      {/* app name */}
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      {/* user input area */}
      <Box sx={{mx: 3}}>
        <TextField
        fullWidth
        multiline
        rows={6}
        variant='outlined'
        label= "Original email content"
        value={emailContent || ''}
        onChange={(e) => setEmailContent(e.target.value)}
        sx={{mb:2}}
        />
        <FormControl fullWidth sx={{mb:2}}>
        <InputLabel>Tone (Optional)</InputLabel>
        <Select
        value={tone || ''}
        label={"Tone (Optional)"}
        onChange={(e) => setTone(e.target.value)}>
          <MenuItem value="">None</MenuItem>
          <MenuItem value="professional">Professional</MenuItem>
          <MenuItem value="casual">Casual</MenuItem>
          <MenuItem value="friendly">Friendly</MenuItem>

        </Select>
        </FormControl>
        <Button
        variant='contained'
        onClick={handleSubmit}
        disabled={!emailContent || loading}
        fullWidth
        >
          {loading ? <CircularProgress size={24}/> : "Generate Reply"}
        </Button>
      </Box>

      {/* indicate errors */}
      {error && (
        <Typography color='error' sx={{mb:2}}>
        {error}
      </Typography>
      )}

      {/* show generated email */}
      {generatedReply && (
        <Box sx={{mx:3}}>
          <Typography variant='h6' gutterBottom>
            Generated Reply:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generatedReply || ''}
          />

          <Button
            variant='outlined'
            sx={{mt:3}}
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy to clipboard
          </Button>
        </Box>
      )}

    </Container>
  )
}

export default App
