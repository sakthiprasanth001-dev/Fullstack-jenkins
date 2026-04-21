pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/sakthiprasanth001-dev/Fullstack-jenkins.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }
}
