# POSion Mobile App - AI Coding Agent Instructions

## Project Overview
POSion is a React Native + Expo-based Point of Sale (POS) mobile application for restaurant management. The app serves both customers (order placement) and employees (order management/analytics). Built with TypeScript, it uses **Expo Router** for file-based routing, **Supabase** for backend services, and **TanStack React Query** for data fetching.

## Architecture Essentials

### App Structure (Expo Router File-Based Routing)
The `src/app/` directory implements routing via file convention:
- `_layout.tsx` files define route layouts (nested stack/navigation structures)
- Directory names in parentheses like `(auth)`, `(screens)`, `(employer)`, `(shared)` define route groups without URL segments
- Example: `src/app/(screens)/OrderClient.tsx` → route `/OrderClient`
- All screens use `<Stack screenOptions={{ headerShown: false }}>` to hide default headers

**Key Insight**: Route organization mirrors role-based access (auth screens, employer-specific screens, shared screens). When adding features, follow this grouping convention.

### State Management Strategy
Three complementary layers handle different concerns:

1. **Global Auth Context** (`src/context/authContext.tsx`)
   - Single source of truth for `user`, `username`, `userRole`
   - Manages Supabase auth session persistence across app restarts
   - Triggers role/profile queries once auth state is established
   - Use `useAuth()` hook to access; throws if used outside `<AuthProvider>`

2. **Zustand Stores** (`src/store/StatesStore.ts`)
   - Lightweight UI state: sidebar visibility, dropdown selections, order item carbs
   - Stores: `useSidebarStore`, `useOrderItemStore`, `useDropdownStore`
   - Example: `useDropdownStore().setSelectedOption('carbo', 'Mee Kuning')` persists menu-specific selections

3. **TanStack React Query** (`@tanstack/react-query`)
   - Server state caching with `useQuery` and `useMutation`
   - Stale times vary: menu data (60min), user profile (5min), tables (5min), discounts (infinite)
   - Pattern: wrap query responses in custom hooks (see `src/hooks/MenuHook.ts`, `OrderClientHook.ts`)
   - Query invalidation on mutations resets dependent queries automatically

### Data Flow: Auth → Profile → Role-Based Access
```
1. Supabase Session Restored → Sets user.id, user.email (from JWT)
2. checkAndAssignUUID runs → Links auth user to employee record by email
3. fetchEmployeeData runs → Queries role & username (enables role-based rendering)
4. Components conditionally render based on userRole
```
This sequential dependency chain is managed by conditional `enabled` flags in React Query.

### Service Layer Pattern (`src/api/`)
Three modules handle backend operations via Supabase:
- `employeeServices.ts`: User lookup, UUID assignment, profile fetching
- `menuServices.ts`: Menu availability, table queries, discount operations
- `orderServices.ts`: Order creation (main orders + line items), order history

**Convention**: Each async function throws or returns structured `{success, data, error}`. Hooks wrap these and pair mutations with `Alert.alert()` for Malay user feedback.

## Key Patterns & Conventions

### Custom Hooks as Query Wrappers
Hooks in `src/hooks/` are **not just utilities**—they're the primary abstraction for data operations:
- `useMenuQuery()` with TypeScript generics enables type-safe data transforms via `select`
- `useSubmitOrder()` combines two mutations + validation + side effects in one place
- `useOrderFlow()` manages carousel navigation state + filtered menu display
- **Rule**: New feature data needs a corresponding hook; don't call query functions directly in components

### Cart & Order Assembly
`useHandleCart()` (`OrderClientHook.ts`) demonstrates the ordering pattern:
- Cart state tracks items with context: `menu_id`, `quantity`, `selectedCarb`, `comments[]`
- Items with same `menu_id` but different `selectedCarb` are distinct cart entries
- **"Soup/Bakso" special case**: only these categories require carb selection dropdown
- Order submission validates: cart not empty → table selected → discount selected
- On success: clears cart, resets dropdowns, shows Malay confirmation alert

### Discount Operations
`discountDetails` interface supports two operations:
- `'multiply'`: percentage discount (e.g., 10% off = value 0.9)
- `'subtract'`: fixed amount (e.g., -5000 Rp)
Applied in `OrderHelper.ts:createOrder()` when calculating `total_price`

### Supabase Integration Details
- **Client initialization** (`lib/supabase-client.ts`): Uses AsyncStorage on native platforms for session persistence
- **Auth auto-refresh**: Automatically refreshes tokens when app returns to foreground
- **RPC calls**: `generateNumberOrder()` calls Postgres function `get_next_order_number()` for atomic order ID generation
- **On-conflict handling**: Order inserts use `onConflict: 'order_id'` to prevent duplicates on retry

## Developer Workflows

### Starting Development
```bash
npm install                    # Install dependencies
npx expo start                 # Start dev server; press 'a' (Android), 'i' (iOS), or 'w' (web)
npm run lint                   # Check ESLint rules (Expo config)
npm test                       # Run Jest tests (if test files exist)
```

### Building for Deployment
- Use EAS (Expo Application Services): managed builds via `app.json` + `eas.json`
- Native builds: `expo run:android` or `expo run:ios` (requires Android Studio/Xcode)
- Web: `npm run web` outputs static files to web directory

### TypeScript & Path Aliases
- Base path: `src/` → use `@/` in imports (e.g., `@/api/menuServices`)
- Strict mode enabled; leverage types from `src/types/`

## Important Files & Locations

| Purpose | File |
|---------|------|
| Root routing setup | `src/app/_layout.tsx` |
| Auth state provider | `src/context/authContext.tsx` |
| Query hooks (data ops) | `src/hooks/MenuHook.ts`, `OrderClientHook.ts` |
| Supabase client | `lib/supabase-client.ts` |
| Type definitions | `src/types/MenuType.ts`, `OrderType.ts` |
| Zustand stores | `src/store/StatesStore.ts` |
| Service functions | `src/api/*.ts` |
| Reusable components | `src/component/*.tsx` |
| Constants | `src/constants/Roles.ts`, `Colors.ts`, `DineOptions.ts` |

## Malay Localization Notes
Error messages and alerts use Malay (Bahasa Melayu). Common terms:
- "Ralat" = Error
- "Sila" = Please
- "Gagal" = Failed
- "Berjaya" = Success
- "Pesanan" = Order
- "Dapur" = Kitchen
Maintain this in user-facing strings.

## Common Pitfalls to Avoid
1. **Calling async functions directly in render**: Use hooks + React Query instead
2. **Forgetting `enabled` flag in useQuery**: Dependent queries won't wait for data
3. **Not wrapping new data fetching in a hook**: Violates the custom-hook pattern
4. **Direct Supabase calls in components**: All Supabase operations belong in `src/api/` or hooks
5. **Modifying cart without considering `selectedCarb`**: Soup/Bakso items need carb context to distinguish duplicates

## Testing
- Jest preset configured (`jest-expo`)
- Testing library setup: `@testing-library/react-native`, `@testing-library/jest-native`
- Write tests for: hooks (query/mutation behavior), utilities (`OrderHelper.ts`), new custom components
