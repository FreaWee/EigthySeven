export default function Header() {
    return (<>
      <div className="bg-white w-full flex justify-between p-3 m-0">
        <div>Logo</div>
        <div className="h-10">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ==" crossOrigin="anonymous" referrerPolicy="no-referrer"/>
          <i className=" fa-solid fa-house"></i>
        </div>
      </div>
      <div className="mb-6 bg-white text-3xl text-[#325084] text-center font-serif">
        The Interactive-Map <div className="text-xs ">By EightySeven ©</div>
      </div>
    </>);
}
