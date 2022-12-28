export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "Tập tin không tồn tại!");

  // if (file.size > 1024 * 1024)
    //1mb
    // err = "Vui lòng chọn kích thước của ảnh nhỏ hơn 1mb!.";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Chọn ảnh không hợp lệ!";

  return err;
};

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();

    if (item.camera) {
      formData.append("file", item.camera);
    } else {
      formData.append("file", item);
    }

    formData.append("upload_preset", "i1oo9xjo");
    formData.append("cloud_name", "dvt3nev9q");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dvt3nev9q/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }

  return imgArr;
};
