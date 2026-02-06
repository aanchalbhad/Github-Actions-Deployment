                                   ----------------------------Git command for VS-Code--------------------------------

1. git init
2. git add .
3. git commit -m "official commit"
4. git branch -M main
5. git remote add origin https://github.com/git-hub-account-name/repo-name.git
6. git push -u origin main


                                  --------------------------Create instance and run below commands----------------------------------
# Update system
sudo apt update && sudo apt upgrade -y


# Install prerequisites
sudo apt install apt-transport-https ca-certificates curl software-properties-common git -y


# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg


# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


# Update package index
sudo apt update


# Install Docker
sudo apt install docker-ce docker-ce-cli containerd.io -y


# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker


# Add current user to docker group
sudo usermod -aG docker $USER


# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


# Install Nginx
sudo apt install nginx -y


# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx


# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

                                    -------------------------Security ports----------------------------------


open port on : 4005 from inbound rules 

                                  --------------------------- Inside Instamce-----------------------------------


mkdir deployment
cd deployment
vi docker-compose.yml
services:
  api-gateway:
    image: aanchalb13/test-api-gateway:latest
    build:
      context: ./backend/api-gateway
      dockerfile: Dockerfile
    container_name: test-api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=hjbascbkhesf324hcsjknsdc
      - USER_SERVICE_URL=http://user-service:3001
      - WORKSHEET_SERVICE_URL=http://worksheet-service:3002
      - PAYMENT_SERVICE_URL=http://payment-service:3003
      - NOTIFICATION_SERVICE_URL=http://notification-service:3004
      - API_GATEWAY_URL=http://localhost:3000
      - CORS_ORIGINS=http://localhost:4005,http://54.152.26.121:4005,http://localhost:3001
    depends_on:
      - user-service
      - worksheet-service
      - payment-service
      - notification-service
    networks:
      - test-network

  user-service:
    image: aanchalb13/test-user-service:latest
    build:
      context: ./backend/user-service
      dockerfile: Dockerfile
    container_name: test-user-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - MONGODB_URL=mongodb+srv://yogesh3332:tCGdpj1IHnID13J4@cluster0.pwjc7nq.mongodb.net/microservice?retryWrites=true&w=majority&appName=Cluster0
      - JWT_SECRET=hjbascbkhesf324hcsjknsdc
    networks:
      - test-network

  worksheet-service:
    image: aanchalb13/test-worksheet-service:latest
    build:
      context: ./backend/worksheet-service
      dockerfile: Dockerfile
    container_name: test-worksheet-service
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
      - MONGODB_URL=mongodb+srv://yogesh3332:tCGdpj1IHnID13J4@cluster0.pwjc7nq.mongodb.net/microservice?retryWrites=true&w=majority&appName=Cluster0
      - JWT_SECRET=hjbascbkhesf324hcsjknsdc
    networks:
      - test-network

  payment-service:
    image: aanchalb13/test-payment-service:latest
    build:
      context: ./backend/payment-service
      dockerfile: Dockerfile
    container_name: test-payment-service
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
      - PORT=3003
      - MONGODB_URL=mongodb+srv://yogesh3332:tCGdpj1IHnID13J4@cluster0.pwjc7nq.mongodb.net/microservice?retryWrites=true&w=majority&appName=Cluster0
    networks:
      - test-network

  notification-service:
    image: aanchalb13/test-notification-service:latest
    build:
      context: ./backend/notification-service
      dockerfile: Dockerfile
    container_name: test-notification-service
    ports:
      - "3004:3004"
    environment:
      - NODE_ENV=production
      - PORT=3004
    networks:
      - test-network

  frontend:
    image: aanchalb13/test-frontend:latest
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=http://54.152.26.121:3000
    container_name: test-frontend
    ports:
      - "4005:3000"
    depends_on:
      - api-gateway
    networks:
      - test-network

networks:
  test-network:
    driver: bridge 

docker ps 
