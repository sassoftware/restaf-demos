# utility script to kill process running on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F