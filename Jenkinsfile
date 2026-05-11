pipeline {
agent any

```
tools {
    nodejs "nodejs"
}

environment {
    SONAR_HOME = tool "sonar-scanner"
}

stages {

    stage('Checkout Code') {
        steps {
            git branch: 'main',
            url: 'https://github.com/sakthiprasanth001-dev/Fullstack-jenkins.git'
        }
    }

    stage('SonarQube Analysis') {
        steps {
            withSonarQubeEnv('sonarqube') {

                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {

                    sh """
                    echo "Node Version:"
                    node -v

                    echo "NPM Version:"
                    npm -v

                    echo "Run Sonar Scanner..."

                    ${SONAR_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=fullstack-app \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://52.66.247.88:9000 \
                    -Dsonar.login=$SONAR_TOKEN
                    """
                }
            }
        }
    }

    stage('Quality Gate') {
        steps {
            timeout(time: 2, unit: 'MINUTES') {
                waitForQualityGate abortPipeline: false
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
```

}
