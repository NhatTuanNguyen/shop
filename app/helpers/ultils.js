
let createFilterStatus = async (params,collection) => {
    const currentModel = require(__path_schemas + collection);

    let statusFilter = [
        { name: "all", count: 1, link: "#", class: "default" },
        { name: "active", count: 2, link: "#", class: "default" },
        { name: "inactive", count: 3, link: "#", class: "default" },
    ]

    // statusFilter.forEach((item, index) => {
    for (let index = 0;index < statusFilter.length;index++) {
        let item = statusFilter[index];
        let objWhere = (item.name !== 'all') ? {status:item.name}:{};
        if (params.categoryId !== "novalue" && params.categoryId !== undefined) objWhere['category.id'] = params.categoryId;
        if (params.keyword !== "") objWhere.name = new RegExp(params.keyword, 'i');
        if (item.name === params.currentStatus) statusFilter[index].class = "success";
        await currentModel.count(objWhere).then((data) => {
            statusFilter[index].count = data
        })
    }
    return statusFilter;
}

module.exports = {
    createFilterStatus:createFilterStatus,
}