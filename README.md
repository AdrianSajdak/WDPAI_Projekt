# GymManagement

Platforma do zarządzania siłownią i zajęciami grupowymi. Projekt łączy **Django REST Framework** (backend) z **React.js** (frontend) oraz integruje logowanie przez Google OAuth2 i JWT (SimpleJWT).

## Funkcjonalności

1. **Rejestracja i logowanie użytkowników**  
   - Rejestracja przez formularz + weryfikacja haseł  
   - Logowanie standardowe (JWT)  
   - Logowanie Google OAuth2 (pozwala na szybkie logowanie)

2. **Panel użytkownika (User Panel)**  
   - Podgląd swojego członkostwa (Membership)  
   - Możliwość dołączania/opuszczania zajęć (klasy)

3. **Panel trenera (Trainer Panel)**  
   - Tworzenie zajęć grupowych bądź indywidualnych  
   - Zarządzanie klasami, ustalanie limitów (capacity)

4. **Panel administratora (Admin Panel)**  
   - Tworzenie planów członkowskich (MembershipPlan)  
   - Zarządzanie listą trenerów (nadawanie roli) i ich specjalizacji  
   - Podgląd i usuwanie klas

5. **Logowanie przez Google**  
   - Wystarczy skonfigurować Google Cloud Credentials i wstawić `GOOGLE_CLIENT_ID` w `settings.py`  

6. **Swagger/Redoc** (dokumentacja API)  
   - Dostępne pod `/swagger/` i `/redoc/`  

## Technologia

- **Backend**: Django + Django REST Framework  
  - Model CustomUser (rozszerzony AbstractUser)  
  - SimpleJWT do zarządzania tokenami  
  - Google OAuth2 (pakiet `google-auth`/ `google.oauth2`)  

- **Frontend**: React.js (utworzony przez `create-react-app`)  
  - Logowanie i rejestracja (JWT przechowywany w `sessionStorage`)  
  - Logowanie przez Google  
  - Panel użytkownika / Panel trenera / Admin panel

- **Baza danych**: PostgreSQL  
  - Konfiguracja w `settings.py` (host, port, user, password)  

- **Konteneryzacja**: Docker + Docker Compose (opcjonalnie)  

- **CI/CD**: GitHub Actions  
  - Uruchamianie testów Django i sprawdzanie, czy projekt się buduje  

