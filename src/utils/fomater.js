export const Fomater = (number) => {
    return new Intl.NumberFormat("vi-VN",
        {
            style: "currency",
            currency: "VND"
        }
    ).format(number);
}