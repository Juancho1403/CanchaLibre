import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import imagenDefaultRoute from "/soccer.ico"
const firebaseConfig = {
    apiKey: "AIzaSyCiLJwqM24SKeCi2cdoQ36meFmaqJwICXA",
    authDomain: "devlights-reservacanchas.firebaseapp.com",
    projectId: "devlights-reservacanchas",
    storageBucket: "devlights-reservacanchas.appspot.com",
    messagingSenderId: "173467322937",
    appId: "1:173467322937:web:0324e1c163397ed5e95be8"
  };
  
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);


export function ImagenYrecursos() {
    const [modify, setModify] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const metadata = {
    contentType: 'image/jpeg',
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const storageRef = ref(storage, selectedFile.name);
    const uploadTask = uploadBytes(storageRef, selectedFile, metadata)
    .then((snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        getDownloadURL(storageRef).then((url) => {
            console.log("Seteo de URL")
            setDownloadURL(url)
            setModify(false)
        })
    })
  };


  return (
    <div className="flex flex-col items-stretch w-full max-w-[300px] mx-auto">
      <div className="rounded-2xl border border-slate-600/80 bg-slate-900/60 overflow-hidden aspect-square flex items-center justify-center shadow-xl">
        {downloadURL ? (
          <img src={downloadURL} className="w-full h-full object-cover" alt="Tu foto" />
        ) : (
          <img src={imagenDefaultRoute} className="w-2/3 h-2/3 object-contain opacity-90" alt="Foto de perfil" />
        )}
      </div>
      {modify === false ? (
        <button
          className="btn-primary w-full mt-4 py-3 rounded-xl text-sm font-semibold"
          type="button"
          onClick={() => setModify(!modify)}
        >
          Modificar imagen
        </button>
      ) : (
        <button
          className="mt-4 w-full py-3 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800 text-sm font-medium"
          type="button"
          onClick={() => setModify(!modify)}
        >
          Cancelar
        </button>
      )}
        {modify &&
        <div>
            
            <form className="flex justify-center flex-wrap w-full">
            <h1 className="text-lg font-bold font-sans px-2 py-1 rounded-lg hidden sm2:flex">Subir imagen</h1>
                <div className=" flex w-full justify-center">
                    <label className="block">
                        <input type="file" onChange={handleFileChange} className="block w-full text-sm bg-transparent text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                    </label>
                </div>
                <div className="flex w-100">
                    <button
                      type="button"
                      onClick={handleUpload}
                      className="btn-primary w-full mt-4 py-2.5 px-4 rounded-xl text-sm font-semibold"
                    >
                      Subir imagen
                    </button>
                </div>
                {uploadProgress > 0 && (
                <div>
                    <progress value={uploadProgress} max="100" />
                </div>
                )}
                
            </form>
        </div>
        }
    </div>
  );
}
