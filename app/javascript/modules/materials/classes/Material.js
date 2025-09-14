import WorkflowState from "./WorkflowState";

export default class Material {
    constructor(materialData) {
        this._id = materialData.id;
        this._path = materialData.path;
        this._filename = materialData.filename;
        this._sizeHuman = materialData.size_human;
        this._title = materialData.title;
        this._description = materialData.description;
        this._workflowState = new WorkflowState(materialData.workflow_state);
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get path() {
        return this._path;
    }

    get filename() {
        return this._filename;
    }

    get sizeHuman() {
        return this._sizeHuman;
    }

    get isPublic() {
        return this._workflowState.toString() === 'public';
    }
}
