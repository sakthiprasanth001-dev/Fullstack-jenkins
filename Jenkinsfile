pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        SONAR_PROJECT_KEY = 'fullstack-app'
        SONAR_HOST_URL = 'http://52.66.247.88:9000'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sakthiprasanth001-dev/Fullstack-jenkins.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                    echo "Node Version:"
                    node -v

                    echo "NPM Version:"
                    npm -v

                    echo "Installing dependencies..."
                    npm install || true

                    echo "Running SonarQube Scan..."
                    sonar-scanner \
                      -Dsonar.projectKey=$SONAR_PROJECT_KEY \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=$SONAR_HOST_URL \
                      -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t backend-app ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t frontend-app ./frontend'
            }
        }

        stage('Run Backend') {
            steps {
                sh 'docker rm -f backend || true'
                sh 'docker run -d -p 5000:5000 --name backend backend-app'
            }
        }

        stage('Run Frontend') {
            steps {
                sh 'docker rm -f frontend || true'
                sh 'docker run -d -p 3000:3000 --name frontend frontend-app'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline SUCCESS'
        }
        failure {
            echo '❌ Pipeline FAILED'
        }
    }
}
