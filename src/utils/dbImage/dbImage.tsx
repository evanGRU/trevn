import Image, { ImageProps } from "next/image";

type AvatarImageProps = ImageProps & { src: string };

export const DbImage = (props: AvatarImageProps) => {
    return (
        <Image
            {...props}
            unoptimized={process.env.NEXT_PUBLIC_APP_ENV === "development"}
        />
    );
};