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


1. mkdir deployment
2. cd deployment
3. vi docker-compose.yml    (copy docker-compose.yml file and save )
4. docker ps 
