import { ThemeProvider, useTheme } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useNavigate,
	useParams,
} from "react-router-dom";
import "./App.css";
import { ColorModeContext, tokens, useMode } from "./contexts/theme";
import HomePage from "./pages/home";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import PageContextProvider, { PageContext } from "./contexts/page";
import { ToastContainer } from "react-toastify";
import RightConnectDrawer from "./components/RightConnectDrawer";
import AppNavBar from "./components/AppNavBar2";
import Saved from "./pages/saved";


function App() {
	const { theme, toggleColorMode } = useMode();
	return (
		<ColorModeContext.Provider value={{ toggleColorMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<PageContextProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/draw/:drawId" element={<HomePage />} />
              <Route path="/draw" element={<HomePage />} />
              <Route path="/annotations" element={<Saved />} />
							<Route path="*" element={<>Not Found</>} />
						</Routes>
					</BrowserRouter>
					<ToastContainer
						position="bottom-left"
						autoClose={5000}
						hideProgressBar={false}
						closeOnClick
						pauseOnFocusLoss
						pauseOnHover
						theme={theme.palette.mode}
					/>
				</PageContextProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
