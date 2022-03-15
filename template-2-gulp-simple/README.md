# Gulp 4
## 프로그램 설치(최초에만 1회 설치)
### 1. 노드 JS 설치
- SCSS 트랜스파일러 모듈(node-sass)을 위해 node.js `ver.14`로 고정
- [Node.js 다운로드 페이지](https://nodejs.org/download/release/v14.19.0) 목록에서 `node-v14.19.0-x64.msi` 설치

### 2. Gulp Cli 설치
- Gulp 모듈(프로그램)을 글로벌 환경에서 실행하기 위한 목적
- `npm install --global gulp-cli`

### 3. 브라우저 리로딩 확장프로그램
- 수정하는 SCSS, JS, Images, HTML을 감지하여 브라우저 리프레쉬를 자동으로 수행하도록 해주는 크롬브라우저 확장 프로그램
- gulp-livereload에 대한 [내용 보기](https://webclub.tistory.com/471)
- [확장 프로그램 설치하기](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

## 설정 안내
### 빌드에서 사용되는 파일
- `preset/config`: 프로젝트시 사용하는 Gulp에서 참조하는 리소스와 빌드 경로 설정(커스텀 설정)
- `preset/PresetConstant.js`: 복잡한 참조 경로일경우 상수화하여 별도 관리

### 이슈
- **PowerShell** 오류: 이 시스템에서 스크립트를 실행할 수 없으므로 파일을 로드할 수 없습니다. 자세한 내용은 about_Execution_Policies를 참조하십시오 (오류 내용)
  - Visual Studio Code IDE 툴에서 TERMINAL 을 사용하여 gulp 실행시 또는 다른 명령어 사용시 에러 해결
  - [오류 내용 및 해결을 위한 참고 사항](https://dog-developers.tistory.com/183)
  - **오류 해결 절차**:
    1. npm uninstall --global gulp-cli 일단 지우고
    2. windows PowerShell 프로그램을 관리자 권한으로 실행합니다.
    3. Get-ExecutionPolicy 명령어를 작성하면 본인의 권한? 상태가 보여집니다.
    4. 권한이 RemoteSigned 가 아니라면 Set-ExecutionPolicy RemoteSigned 를 입력 후 엔터 --> Y
    5. Get-ExecutionPolicy 명령어로 다시 한번 확인 하면 RemoteSigned로 변경 확인 
    6. RemoteSigned 확인 후 npm install --global gulp-cli 설치

### 모듈 레퍼런스
- 빌드 시 사용하는 모듈 안내

### 퍼블리싱 안내
- 퍼블리싱 개발 환경 구성을 위한 세팅법
  1. AI Lab실에서 사용하는 GitLab 서버에 공유되는 퍼블리싱 개발 환경용 프로젝트 파일을 받기 위한 폴더를 생성
  2. 윈도우 터미널 열기(윈도우 키 + R) ==> 입력창에 'cmd' 입력<br>
      **예시)**
      - 드라이브 선택( C드라이브 --> D드라이브) `C://myFolder D:`
      - 소스를 받기 위한 디렉토리로 이동 `cd [다운로드하고자하는 폴더 경로]`
      - 깃랩에서 소스 받기(이동한 디렉토리에 붙여넣고 실행): `git clone https://gitlab.ziny.us/design-center/saltlux-html-template`
      - 패키지 실행 `npm install`
      - 프로젝트 실행을 위한 명령어 입력
        - 개발모드 실행: gulp
        - 빌드모드(배포용) 실행: gulp build
