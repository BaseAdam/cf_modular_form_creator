import { useNavigate, useParams } from 'react-router-dom'
import type { BasicInfo, Resource } from '../types/resource'
import { isDraft } from '../features/resources/rules'
import { validateBasicInfo } from '../features/resources/validation'
import { BasicInfoForm } from '../features/resources/forms/BasicInfoForm'
import { ModuleEditorShell } from '../features/resources/components/ModuleEditorShell'
import { ResourceLoader } from '../features/resources/components/ResourceLoader'
import { useModuleEditor } from '../features/resources/hooks/useModuleEditor'
import {
  useReplaceResource,
  useUpdateBasicInfo,
} from '../features/resources/hooks/useResourceMutations'

export function BasicInfoPage() {
  const { resourceId } = useParams()
  return (
    <ResourceLoader id={resourceId}>
      {(resource) => (
        <BasicInfoEditor key={resource.updatedAt} resource={resource} />
      )}
    </ResourceLoader>
  )
}

function BasicInfoEditor({ resource }: { resource: Resource }) {
  const navigate = useNavigate()
  const id = String(resource.resourceId)
  const draft = isDraft(resource)

  const editor = useModuleEditor<BasicInfo>({
    isDraft: draft,
    serverValue: resource.basicInfo,
    validate: validateBasicInfo,
    toReplacePayload: (values) => ({
      name: resource.name,
      basicInfo: values,
      projectDetails: resource.projectDetails,
    }),
    patchMutation: useUpdateBasicInfo(id),
    replaceMutation: useReplaceResource(id),
  })

  const goToOverview = () => navigate(`/resources/${id}`)

  return (
    <ModuleEditorShell
      resource={resource}
      title="Basic Info"
      isDirty={editor.isDirty}
      isSaving={editor.isSaving}
      canSave={editor.isDirty}
      submitError={editor.submitError}
      saveLabel={draft ? 'Save Basic Info' : 'Submit changes'}
      onSave={() => editor.submit(goToOverview)}
      onCancel={goToOverview}
    >
      <BasicInfoForm
        values={editor.values}
        errors={editor.errors}
        disabled={editor.isSaving}
        onChange={editor.setField}
      />
    </ModuleEditorShell>
  )
}
