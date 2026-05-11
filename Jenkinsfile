pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        NEXUS_PASS = credentials('nexus-pass')
        NEXUS_URL = "52.66.247.88:8082"
    }

    tools {
        nodejs 'node18'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/sakthiprasanth001-dev/Fullstack-jenkins.git',
                    branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    cd backend && npm install
                    cd ../frontend && npm install
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=fullstack-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://52.66.247.88:9000 \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
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

        stage('Push Backend to Nexus') {
            steps {
                withCredentials([string(credentialsId: 'nexus-pass', variable: 'NEXUS_PASS')]) {
                    sh '''
                        echo $NEXUS_PASS | docker login $NEXUS_URL -u admin --password-stdin
                        docker tag backend-app $NEXUS_URL/docker-hosted/backend-app:latest
                        docker push $NEXUS_URL/docker-hosted/backend-app:latest
                    '''
                }
            }
        }

        stage('Push Frontend to Nexus') {
            steps {
                withCredentials([string(credentialsId: 'nexus-pass', variable: 'NEXUS_PASS')]) {
                    sh '''
                        echo $NEXUS_PASS | docker login $NEXUS_URL -u admin --password-stdin
                        docker tag frontend-app $NEXUS_URL/docker-hosted/frontend-app:latest
                        docker push $NEXUS_URL/docker-hosted/frontend-app:latest
                    '''
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    docker rm -f backend || true
                    docker pull $NEXUS_URL/docker-hosted/backend-app:latest
                    docker run -d -p 5000:5000 --name backend $NEXUS_URL/docker-hosted/backend-app:latest
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    docker rm -f frontend || true
                    docker pull $NEXUS_URL/docker-hosted/frontend-app:latest
                    docker run -d -p 3000:3000 --name frontend $NEXUS_URL/docker-hosted/frontend-app:latest
                '''
            }
        }
    }
}
