pipeline {
    agent any

    environment {
        // 定义环境变量
        SERVER_IP = '128.199.224.162'
        SERVER_NAME = 'do001-why-ubuntu'        		// 服务器IP地址
        SERVER_USER = 'root'    					// 服务器用户名
        TARGET_DIR = '/opt/module/react-app'               // 服务器上的目标目录
        BUILD_DIR = 'build'                         // React 项目打包后的目录
        PORT = '5000'                               // 服务器上运行的端口
        CI = 'false' // 设置 CI 环境变量为 false，避免 React 项目在构建时提示 CI 环境
    }

    stages {
        stage('Clone Source Code') {
            steps {
                // 拉取项目源码
                git branch: 'master', url: 'https://github.com/zht1014/Stu-Info-Management.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                ansiColor('xterm') {
                    // 安装项目依赖
                    sh 'npm install'
                }
            }
        }
        stage('Build Project') {
            steps {
                ansiColor('xterm') {
                    // 构建 React 项目
                    sh 'npm run build'
                }
            }
        }
        stage('Verify Build Output') {
            // 验证构建结果
            steps {
                sh 'ls -l ${BUILD_DIR}/'
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Step 1: 传输文件到远程服务器
                    sh """
                        scp -r -v -o StrictHostKeyChecking=no ${BUILD_DIR}/* ${SERVER_USER}@${SERVER_NAME}:${TARGET_DIR}
                    """

                    // Step 2: 使用 serve 启动静态文件服务器
                    // Step 3: 终止已存在的 serve 进程
                    def killStatus = sh(script: """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_NAME} 'pgrep -f serve | xargs kill -9 || true'
                    """, returnStatus: true)
                    echo "Kill process exit status: ${killStatus}"

                    // Step 4: 启动 serve 并监听指定端口
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_NAME} 'nohup serve -s ${TARGET_DIR} -l ${PORT} > /dev/null 2>&1 &'
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment finished successfully'
            echo "You can access the React app at http://${SERVER_IP}:${PORT}"
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
