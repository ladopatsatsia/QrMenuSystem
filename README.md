# Menu Management System - Run Instructions

## Backend Setup (.NET 8)
1. Navigate to the root folder: `QrMenuSystem`
2. Open the solution in Visual Studio or VS Code.
3. Update the connection string in `MenuManagement.API/appsettings.json` if needed.
4. Run the database migrations:
   ```bash
   dotnet ef database update -p MenuManagement.Persistence -s MenuManagement.API
   ```
5. Run the API:
   ```bash
   dotnet run --project MenuManagement.API
   ```
   The API will be available at `https://localhost:7085` (or check your console output).

## Frontend Setup (Angular)
1. Navigate to `frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:4200`.

## Testing the System
- **Public**: Visit `http://localhost:4200` to see the sample venues.
- **Admin**: Visit `http://localhost:4200/admin/login`.
  - **Username**: `admin`
  - **Password**: `admin123`
- Use the Dashboard to manage venues, menus, and items.
