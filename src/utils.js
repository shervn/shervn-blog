export const uid = () => (Math.random() + 1).toString(36).substring(2);

export function getImagePath(image_name){
        return `${process.env.PUBLIC_URL}/images/Misc/${image_name}` 
}

export const loadData = async (func, path) => {

        try {
                const response = await fetch(process.env.PUBLIC_URL + `/data/${path}.json`);
                if (response.ok) {
                        const jsonData = await response.json();
                        if (Array.isArray(jsonData)) {
                                jsonData.sort(
                                        function (a, b) {
                                                return b.order - a.order
                                        }
                                );
                        }
                        else {
                        }
                        func(jsonData);
                } else {
                }
        } catch (error) {
                func([]);
        }
}