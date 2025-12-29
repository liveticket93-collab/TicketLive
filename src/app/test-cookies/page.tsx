"use client";

import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/services/auth.service";

export default function TestCookiesPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [userData, setUserData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const checkAuth = async () => {
    setStatus("loading");
    try {
      const user = await fetchUserProfile();
      setUserData(user);
      setStatus("success");
    } catch (err: any) {
      console.error("Test Cookie Error:", err);
      setErrorMsg(err.message || "Error desconocido");
      setStatus("error");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🍪 Cookie Test Page</h1>
      
      <div className="mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <p className="mb-2">
          <strong>Estado:</strong> 
          {status === "loading" && <span className="text-yellow-500 ml-2">Cargando... ⏳</span>}
          {status === "success" && <span className="text-green-500 ml-2">Éxito ✅</span>}
          {status === "error" && <span className="text-red-500 ml-2">Error ❌</span>}
        </p>

        {status === "success" && (
          <div className="mt-4 text-green-700 dark:text-green-300">
            <p>¡Cookie detectada correctamente!</p>
            <pre className="mt-2 p-2 bg-black text-white rounded text-sm overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 text-red-700 dark:text-red-300">
            <p>No se pudo obtener el perfil. Posibles causas:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>No has iniciado sesión.</li>
              <li>La cookie no se guardó (revisa HttpOnly/Secure).</li>
              <li>CORS sigue bloqueando la petición.</li>
            </ul>
            <p className="mt-2 font-mono text-sm bg-red-100 p-1 rounded border border-red-200">
              {errorMsg}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={checkAuth}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Reintentar Test
      </button>

      <p className="mt-8 text-xs text-gray-500">
        Esta es una página temporal. Se eliminará después del test.
      </p>
    </div>
  );
}
